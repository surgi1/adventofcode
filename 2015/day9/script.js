// this is a traveling salesman problem
// still used brute-force BFS, as was quicker to implement and runs in no time
let locs = {}, longest = 0, shortest = Number.MAX_SAFE_INTEGER, p;

input.split("\n").map(line => {
    let tmp = line.split(' ');
    if (locs[tmp[0]] === undefined) locs[tmp[0]] = {d:{}};
    if (locs[tmp[2]] === undefined) locs[tmp[2]] = {d:{}};
    locs[tmp[0]].d[tmp[2]] = Number(tmp[4]);
    locs[tmp[2]].d[tmp[0]] = Number(tmp[4]);
})

let stack = Object.keys(locs).map(loc => ({
    current: loc,
    toVisit: Object.keys(locs).filter(l => l != loc),
    dist: 0
}));

while (p = stack.pop()) {
    if (p.toVisit.length === 0 && p.dist < shortest) shortest = p.dist;
    if (p.toVisit.length === 0 && p.dist > longest) longest = p.dist;
    p.toVisit.forEach(newLoc => stack.push({
        current: newLoc,
        dist: p.dist + locs[p.current].d[newLoc],
        toVisit: p.toVisit.filter(l => l != newLoc)
    }))
}

console.log('p1:', shortest, ', p2:', longest);