let s, stack;

const D = {
    N: 0,
    S: 1,
    E: 2,
    W: 3
}

const dir = [
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: 1, y: 0},
    {x: -1, y: 0},
]

const getLinks = (v, x, y) => {
    switch (v) {
        case '|': return [D.S, D.N];
        case '-': return [D.W, D.E];
        case 'L': return [D.N, D.E];
        case 'J': return [D.N, D.W];
        case '7': return [D.S, D.W];
        case 'F': return [D.S, D.E];
        case 'S': s = {x: x, y: y}; return [];
    }
    return [];
}

let map = input.split("\n").map((line, y) => line.split('').map((v, x) => ({
    v: v,
    links: getLinks(v, x, y)
})));

// determine the start pipe
if (s.x > 0 && map[s.y][s.x-1].links.includes(D.E)) map[s.y][s.x].links.push(D.W);
if (s.x < map[0].length-1 && map[s.y][s.x+1].links.includes(D.W)) map[s.y][s.x].links.push(D.E);
if (s.y > 0 && map[s.y-1][s.x].links.includes(D.S)) map[s.y][s.x].links.push(D.N);
if (s.y < map.length-1 && map[s.y+1][s.x].links.includes(D.N)) map[s.y][s.x].links.push(D.S);

stack = [{p: s, dist: 0}];

// flood fill along the pipe
while (n = stack.shift()) {
    if (map[n.p.y][n.p.x].dist !== undefined && map[n.p.y][n.p.x].dist <= n.dist) continue;
    map[n.p.y][n.p.x].dist = n.dist;
    map[n.p.y][n.p.x].links.forEach(d => stack.push({
        p: {x: n.p.x + dir[d].x, y: n.p.y + dir[d].y},
        dist: n.dist+1
    }))
}

console.log('p1', Math.max(...map.flat().map(p => p.dist === undefined ? 0 : p.dist)));

// p2: construct a real maze, where pipes are walls
let maze = Array(map.length*3), mazeDist = Array(map.length*3);

map.forEach((row, y) => row.forEach((v, x) => {
    let submap = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]];

    if (v.dist === undefined) submap[1][1] = 2; else {
        submap[1][1] = 1; // impassabru
        v.links.forEach(d => submap[1 + dir[d].y][1 + dir[d].x] = 1)
    }

    // copy submap into maze
    for (let i = 0; i <= 2; i++) {
        if (maze[y*3+i] === undefined) {
            maze[y*3+i] = Array(map[0].length*3);
            mazeDist[y*3+i] = Array(map[0].length*3);
        }
        for (let j = 0; j <= 2; j++) maze[y*3+i][x*3+j] = submap[i][j];
    }
}))

stack = [];

map.forEach((row, y) => row.forEach((v, x) => {
    if ((y*x == 0 || y == map.length-1 || x == map[0].length-1) && map[y][x].dist === undefined) stack.push({p: {x: x*3, y: y*3}, dist: 0});
}))

// flood fill from the not-my-pipe map borders
while (n = stack.shift()) {
    if (maze[n.p.y] === undefined || maze[n.p.y][n.p.x] === undefined || maze[n.p.y][n.p.x] == 1) continue;
    if (mazeDist[n.p.y][n.p.x] !== undefined && mazeDist[n.p.y][n.p.x] <= n.dist) continue;
    mazeDist[n.p.y][n.p.x] = n.dist;
    dir.forEach(d => stack.push({
        p: {x: n.p.x + d.x, y: n.p.y + d.y},
        dist: n.dist+1
    }))
}

console.log('p2', map.map((row, y) => row.reduce((a, v, x) => a + (v.dist === undefined && mazeDist[y*3][x*3] === undefined ? 1 : 0), 0)).reduce((a, v) => a+v, 0));

// let's draw the thing
const canvas = document.getElementById('root'), ctx = canvas.getContext('2d');
const zoom = 2;

canvas.width = maze[0].length*zoom;
canvas.height = maze.length*zoom;

maze.forEach((row, y) => row.forEach((v, x) => {
    if (v == 0) return true;
    ctx.fillStyle = (v == 1 ? '#000' : (mazeDist[y][x] === undefined ? '#f00' : '#00f' ));
    ctx.fillRect(x*zoom, y*zoom, zoom, zoom);
}))
