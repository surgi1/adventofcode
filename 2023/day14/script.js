let rocks = [], loads = [], p1 = true;

input.split("\n").forEach((row, y) => row.split('').map((v, x) => {
    if (v !== '.') rocks.push({ x:x, y:y, v:v })
}))

let height = Math.max(...rocks.map(o => o.y))+1,
    width = Math.max(...rocks.map(o => o.x))+1;

const load = () => rocks.filter(o => o.v == 'O').reduce((a, o) => a + (height - o.y), 0)

const tilt = dir => {
    rocks.sort((a, b) => {
        switch (dir) {
            case 'n': return a.x == b.x ? a.y - b.y : a.x - b.x;
            case 's': return a.x == b.x ? b.y - a.y : b.x - a.x;
            case 'w': return a.y == b.y ? a.x - b.x : a.y - b.y;
            case 'e': return a.y == b.y ? b.x - a.x : b.y - a.y;
        }
    })

    rocks.forEach((o, i) => {
        if (o.v != 'O') return true;
        switch (dir) {
            case 'n': o.y = i > 0 && rocks[i-1].x == o.x ? rocks[i-1].y+1 : 0; break;
            case 's': o.y = i > 0 && rocks[i-1].x == o.x ? rocks[i-1].y-1 : height-1; break;
            case 'w': o.x = i > 0 && rocks[i-1].y == o.y ? rocks[i-1].x+1 : 0; break;
            case 'e': o.x = i > 0 && rocks[i-1].y == o.y ? rocks[i-1].x-1 : width-1; break;
        }
    })
}

while (true) {
    tilt('n');
    if (p1) p1 = console.log('p1', load());
    tilt('w');
    tilt('s');
    tilt('e');
    let l = load();
    loads.push(l);
    if (loads.filter(n => n == l).length > 1) {
        let id = loads.indexOf(l);
        if (id > 0 && loads[loads.length-2] == loads[id-1]) {
            let step = loads.length - id - 1;
            console.log('p2', loads[id + ((1_000_000_000 - id - 1) % step)]);
            break;
        }
    }
}
