// p2 is slow

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

const tilt = dir => {
    let initLoad = 0;
    rocks.sort((a, b) => {
        switch (dir) {
            case 'north': return a.y - b.y;
            case 'south': return b.y - a.y;
            case 'west': return a.x - b.x;
            case 'east': return b.x - a.x;
        }
    })

    while (initLoad != hash(rocks)) {
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
    }
}

const draw = () => {
    let map = Array.from({length: height}, () => Array(width).fill('.'));
    rocks.forEach(r => map[r.y][r.x] = r.v);
    console.log(map.map(r => r.join('')));
}

let loads = [], i = 0;

while (true) {
    tilt('north');
    if (i == 0) console.log('p1', load(rocks));
    tilt('west');
    tilt('south');
    tilt('east');
    let l = load(rocks);
    console.log(i+1, l);
    loads.push(l);
    if (i > 10 && loads.filter(n => n == l).length > 1) {
        let id = loads.indexOf(l);
        if (id > 0 && loads[loads.length-2] == loads[id-1]) {
            let step = loads.length-1-id;
            console.log('we have a cycle! [init, step] = ', id, step);
            console.log('p2 res', loads[id + ((1000000000 - id - 1) % step)]);
            break;
        }
    }
    i++;
}
