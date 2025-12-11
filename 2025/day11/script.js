const parse = input => {
    let nodes = {};
    input.split('\n').map(line => {
        let tmp = line.split(' ');
        let k = tmp.shift().substr(0, 3)
        nodes[k] = tmp;
    });
    return nodes;
}

const getNrOfPaths = (nodes, start, end, omit = []) => {
    let res = 0, queue = [{k: start, path: []}], cur;

    while (cur = queue.pop()) {
        if (nodes[cur.k] === undefined) continue;

        nodes[cur.k].forEach(to => {
            if (omit.includes(to)) {
                // no action
            } else if (to == end) {
                res++;
            } else if (!cur.path.includes(to)) queue.push({
                k: to,
                path: [...cur.path, to]
            })
        })
    }

    return res;
}

// this is not a generic solution; used https://dreampuf.github.io/GraphvizOnline to draw the nodes and identify the layers
// much more elegant solution would be memoized recursive search to given node, with memo key constructed by node, fft_visited and dac_visited flags
// see script.recursion.js for generic solution
let layers = [
    ['svr'],
    ['pzi', 'zyi', 'muy'],
    ['fft'],
    ['edr', 'ehw', 'vht', 'vjh', 'kqn'],
    ['rpn', 'apc', 'lpz'],
    ['tql', 'jvl', 'cix', 'jyw', 'xct'],
    ['dac'],
    ['qdo', 'sdo', 'ire', 'you'],
    ['out']
]

let nodes = parse(input);

let weights = {};

for (let i = 1; i < layers.length; i++) {
    let cur = layers[i], prev = layers[i-1];
    prev.forEach(from => {
        cur.forEach(to => {
            let omits = cur.filter(n => n != to);
            if (i < layers.length-1) omits.push(...layers[i+1]);
            let res = getNrOfPaths(nodes, from, to, omits)
            weights[from+'_'+to] = res;
        })
    })
}

let queue = [{node: 'svr', layer: 0, paths: 1}], cur, res = 0;

while (cur = queue.pop()) {
    if (cur.node == 'out') {
        res += cur.paths;
        continue;
    }
    layers[cur.layer+1].forEach(to => {
        queue.push({
            node: to,
            paths: cur.paths*weights[cur.node+'_'+to],
            layer: cur.layer+1
        })
    })
}

console.log('p1', weights['you_out']);
console.log('p2', res);
