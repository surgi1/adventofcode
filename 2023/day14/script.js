let rocks = [];
input.split("\n").forEach((row, y) => row.split('').map((v, x) => {
    if (v !== '.') rocks.push({
        x:x, y:y, v:v
    })
}))

let height = Math.max(...rocks.map(o => o.y))+1,
    width = Math.max(...rocks.map(o => o.x))+1;

const load = rocks => rocks.filter(o => o.v == 'O').reduce((a, o) => a + (height - o.y), 0)

const tilt = dir => {
    rocks.sort((a, b) => {
        switch (dir) {
            case 'north': return a.x == b.x ? a.y - b.y : a.x - b.x;
            case 'south': return a.x == b.x ? b.y - a.y : b.x - a.x;
            case 'west': return a.y == b.y ? a.x - b.x : a.y - b.y;
            case 'east': return a.y == b.y ? b.x - a.x : b.y - a.y;
        }
    })

    rocks.forEach((o, i) => {
        if (o.v != 'O') return true;
        switch (dir) {
            case 'north': o.y = i > 0 && rocks[i-1].x == o.x ? rocks[i-1].y+1 : 0; break
            case 'south': o.y = i > 0 && rocks[i-1].x == o.x ? rocks[i-1].y-1 : height-1; break
            case 'west': o.x = i > 0 && rocks[i-1].y == o.y ? rocks[i-1].x+1 : 0; break
            case 'east': o.x = i > 0 && rocks[i-1].y == o.y ? rocks[i-1].x-1 : width-1; break;
        }
    })
}

let loads = [], i = 0;

while (true) {
    tilt('north');
    if (i == 0) console.log('p1', load(rocks));
    tilt('west');
    tilt('south');
    tilt('east');
    let l = load(rocks);
    loads.push(l);
    if (i > 10 && loads.filter(n => n == l).length > 1) {
        let id = loads.indexOf(l);
        if (id > 0 && loads[loads.length-2] == loads[id-1]) {
            let step = loads.length-1-id;
            console.log('p2', loads[id + ((1000000000 - id - 1) % step)]);
            break;
        }
    }
    i++;
}
