const parseInput = (input, nodes = {}) => {
    const getType = n => n == 'start' ? 'START' : n == 'end' ? 'END' : n.toLowerCase() == n ? 'SMALL': 'BIG'
    input.map(l => {
        let tmp = l.split('-');
        tmp.filter(n => !nodes[n]).map((n, i) => nodes[n] = {name: n, conn: [], type: getType(n)})
        nodes[tmp[0]].conn.push(tmp[1]);
        nodes[tmp[1]].conn.push(tmp[0]);
    })
    return nodes;
}

const allPaths = (nodes, canVisitNode) => {
    let paths = [{n: 'start', finished: false, way: ['start'], smallVisited2x: false}], i = 0;
    while (i < paths.length) {
        let path = paths[i];
        if (nodes[path.n].type == 'END') path.finished = true; else nodes[path.n].conn.map(
            next => canVisitNode(nodes, next, path.way, path.smallVisited2x) && paths.push({
                n: next,
                finished: false,
                smallVisited2x: path.smallVisited2x || (nodes[next].type == 'SMALL' && path.way.includes(next)),
                way: [...path.way, next]
            })
        )
        i++;
    }
    return paths.filter(p => p.finished).length;
}

console.log(allPaths(parseInput(input), (nodes, n, way) => {
    if (nodes[n].type == 'START') return false;
    if (nodes[n].type == 'BIG' || nodes[n].type == 'END') return true;
    return !way.includes(n); // for SMALL
}));
console.log(allPaths(parseInput(input), (nodes, n, way, smallVisited2x) => {
    if (nodes[n].type == 'START') return false;
    if (nodes[n].type == 'BIG' || nodes[n].type == 'END') return true;
    // a single SMALL cave can be way twice
    if (!way.includes(n)) return true;
    return !smallVisited2x && (way.lastIndexOf(n) == way.indexOf(n));
}));