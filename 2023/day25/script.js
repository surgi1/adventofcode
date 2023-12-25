// this is not technically a solution (yet), it just generates input to graphviz (even online one works, here: https://dreampuf.github.io/GraphvizOnline - FDP engine)
// generate the svg (see graphviz.svg), figure out which 3 connections to cut, and use run(pairs)
// programatic solution (minimum cut?) TBD after xmas

let nodes = {};

const addNode = (id, conn) => {
    if (nodes[id] === undefined) nodes[id] = conn; else {
        nodes[id].push(...conn);
    }
}

input.split("\n").forEach(line => {
    let [from, toLit] = line.split(': ');
    let to = toLit.split(' ');
    addNode(from, to);
    to.forEach(n => addNode(n, [from]))
})

let ents = Object.entries(nodes);

console.log(nodes, ents.length);

const sumReachableNodes = nodes => {
    let ents = Object.entries(nodes);
    let stack = [ents[0][0]], seen = {}, sum = 0;
    while (stack.length) {
        let cur = stack.pop();
        if (seen[cur]) continue;
        seen[cur] = 1;
        sum++;
        nodes[cur].forEach(n => stack.push(n));
    }
    return sum;
}

const removeConnection = (nodes, n1, n2) => {
    nodes[n1] = nodes[n1].filter(n => n != n2);
    nodes[n2] = nodes[n2].filter(n => n != n1);
    return nodes;
}

const run = (pairs) => {
    let ns = JSON.parse(JSON.stringify(nodes));
    pairs.forEach(pair => removeConnection(ns, ...pair));
    let g1 = sumReachableNodes(ns);
    //if (g1 != Object.keys(ns).length) 
        console.log('reachable nodes', g1, Object.keys(ns).length - g1);
}

//run([]);

run([['txf', 'xnn'], ['tmc', 'lms'], ['jjn', 'nhg']]);

//run([['hfx', 'pzl'], ['bvb', 'cmg'], ['nvd', 'jqt']]);

let s = '';
ents.forEach(([k, v]) => v.forEach(c => s += k + ' -> ' +  c + ';\n'));
console.log(s);