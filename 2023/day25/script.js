// this is not technically a solution (yet), it just generates input to graphviz (see input.dot, then even online version works, here: https://dreampuf.github.io/GraphvizOnline)
// generate the svg (see output.svg), figure out which 3 connections to cut, and use run(pairs)
// also added a poor man's computational approach, check below

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

console.log(nodes);

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
    console.log('reachable nodes', g1, Object.keys(ns).length - g1, 'asnwer is', g1 * (Object.keys(ns).length - g1));
}

//run([]);

run([['txf', 'xnn'], ['tmc', 'lms'], ['jjn', 'nhg']]);

//run([['hfx', 'pzl'], ['bvb', 'cmg'], ['nvd', 'jqt']]);

let s = 'strict graph G {\n';
input.split("\n").forEach(line => {
    let [from, toLit] = line.split(': ');
    s += '\t' + from + ' -- {' + toLit + '};\n';
})
console.log('input for Graphviz:');
console.log(s + '}\n');

console.log(`After you check the graphviz and figure out which connections to cut, return here and run the following command: \nrun([['abc', 'cde'], ['xyz', 'opq'], ['qwe', 'rty']])\n`);

// as a bonus, let's also try to compute it without the fancy tools, shall we
// the following a poor man's approach to min cut, it randomly tries to add starting set of vertices and then adds just the ones that have at least 2 already

let freqs = {};

const monteCarlo = () => {
    let g1 = [], len = g1.length;

    let ks = Object.keys(nodes);
    let startingNode = ks[Math.floor(ks.length * Math.random())];

    g1.push(startingNode, ...nodes[startingNode]);

    for (let i = 0; i < 3; i++)
    g1.forEach(m => nodes[m].forEach(n => {
        if (g1.includes(n)) return true;
        g1.push(n);
    }))

    while (g1.length !== len) {
        len = g1.length;
        Object.entries(nodes).forEach(([n, arr]) => {
            if (g1.includes(n)) return true;
            if (arr.filter(o => g1.includes(o)).length > 1) g1.push(n);
        })

        g1.forEach(m => nodes[m].forEach(n => {
            if (g1.includes(n)) return true;
            if (nodes[n].filter(o => g1.includes(o)).length > 1) g1.push(n);
        }))
    }

    let num = g1.length * (Object.keys(nodes).length - g1.length);
    if (freqs[num] === undefined) freqs[num] = 0;
    freqs[num]++;
}

let iter = 20;

for (let i = 0; i < iter; i++) monteCarlo();

let ans = Object.entries(freqs).sort((a, b) => b[1] - a[1]);
console.log('However, the answer to the puzzle is likely ', Number(ans[0][0]), '. It was hit', ans[0][1], 'out of', iter, 'attempts');