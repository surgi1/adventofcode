let map = input.split("\n");

let parts = [], p1 = 0, p2 = 0;

map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
        if (!isNaN(Number(row[x]))) {
            let s = row[x];
            let startId = x;
            x++;
            while (x < row.length && !isNaN(Number(row[x]))) {
                s += row[x];
                x++;
            }
            parts.push({
                v: Number(s),
                len: s.length,
                y: y,
                fromX: startId,
                toX: x-1
            })
        }
    }
})

const extractLine = (y, p) => {
    if (y < 0 || y > map.length-1) return '';
    let from = p.fromX, to = p.toX;
    if (from > 0) from--;
    if (to < map[0].length-1) to++;
    return map[y].substr(from, to-from+1);
}

parts.forEach(p => {
    let adjs = [p.y-1, p.y, p.y+1].reduce((a, i) => a + extractLine(i, p), '');
    if (adjs.match(/[^\d|\.]/g)) p1 += p.v;
})

console.log(p1);

map.forEach((line, y) => line.split('').forEach((v, x) => {
    if (v !== '*') return true;
    let found = parts.filter(p => p.y >= y-1 && p.y <= y+1 && x >= p.fromX-1 && x <= p.toX+1);
    if (found.length == 2) p2 += found[0].v * found[1].v;
}))

console.log(p2);