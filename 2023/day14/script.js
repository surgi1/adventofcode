// p2 solved by hand after getting the cycle in cycles, programatic solution tbd

let rocks = [];
input.split("\n").forEach((row, y) => row.split('').map((v, x) => {
    if (v !== '.') rocks.push({
        x:x, y:y, v:v
    })
}))

let height = Math.max(...rocks.map(o => o.y))+1,
    width = Math.max(...rocks.map(o => o.x))+1;

const load = rocks => rocks.filter(o => o.v == 'O').reduce((a, o) => a + (height - o.y), 0)

const hash = rocks => rocks.filter(o => o.v == 'O').reduce((a, o) => a + (o.y+1)*width + o.x+1, 0)

console.log(rocks, load(rocks));

const tilt = dir => {
    let initLoad = 0, i = 0;
    while (i < 10000 && initLoad != hash(rocks)) {
        initLoad = hash(rocks);
        rocks.forEach(o => {
            if (o.v !== 'O') return true;
            // get closest rocks above
            if (dir == 'north') {
                let rocksAbove = rocks.filter(r => r.x == o.x && r.y < o.y);
                let tiltTo = (rocksAbove.length > 0) ? Math.max(...rocksAbove.map(r => r.y))+1 : 0;
                o.y = tiltTo;
            } else if (dir == 'south') {
                let rocksAbove = rocks.filter(r => r.x == o.x && r.y > o.y);
                let tiltTo = (rocksAbove.length > 0) ? Math.min(...rocksAbove.map(r => r.y))-1 : height-1;
                o.y = tiltTo;
            } else if (dir == 'west') {
                let rocksAbove = rocks.filter(r => r.y == o.y && r.x < o.x);
                let tiltTo = (rocksAbove.length > 0) ? Math.max(...rocksAbove.map(r => r.x))+1 : 0;
                o.x = tiltTo;
            } else if (dir == 'east') {
                let rocksAbove = rocks.filter(r => r.y == o.y && r.x > o.x);
                let tiltTo = (rocksAbove.length > 0) ? Math.min(...rocksAbove.map(r => r.x))-1 : width-1;
                o.x = tiltTo;
            }

        })
        i++
    }
}

const draw = () => {
    let map = Array.from({length: height}, () => Array(width).fill('.'));
    rocks.forEach(r => map[r.y][r.x] = r.v);
    console.log(map.map(r => r.join('')));
}

for (let i = 0; i < 200; i++) {
    tilt('north');
    if (i == 0) console.log('p1', load(rocks));
    tilt('west');
    tilt('south');
    tilt('east');
    console.log(i+1, load(rocks));
}

// now it is necessary to identify the cycle that should be visible. For my case it was 92 init length and then step of 35
