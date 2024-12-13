let map = input.split("\n"),
    parts = [], p1 = 0, p2 = 0;

map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
        if (isNaN(row[x])) continue;
        let s = row[x], startId = x;
        while (++x < row.length && !isNaN(row[x])) s += row[x];
        parts.push({
            v: Number(s),
            y: y,
            x: {from: startId, to: x-1}
        })
    }
})

const adjLine = (y, p) => {
    if (y < 0 || y > map.length-1) return '';
    let from = p.x.from, to = p.x.to;
    if (from > 0) from--;
    if (to < map[0].length-1) to++;
    return map[y].substr(from, to-from+1);
}

parts.forEach(p => {
    if ([p.y-1, p.y, p.y+1].reduce((a, i) => a + adjLine(i, p), '').match(/[^\d|\.]/g)) p1 += p.v;
})

console.log(p1);

map.forEach((line, y) => line.split('').forEach((v, x) => {
    if (v !== '*') return true;
    let found = parts.filter(p => p.y >= y-1 && p.y <= y+1 && x >= p.x.from-1 && x <= p.x.to+1);
    if (found.length == 2) p2 += found[0].v * found[1].v;
}))

console.log(p2);