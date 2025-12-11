const parse = input => {
    let nodes = {};
    input.split('\n').map(line => {
        let tmp = line.split(' ');
        let k = tmp.shift().substr(0, 3)
        nodes[k] = tmp;
    });
    return nodes;
}

const recurP1 = (nodes, node, seen = new Map()) => {
    if (node === 'out') return 1;

    if (seen.has(node)) return seen.get(node);

    let paths = nodes[node].reduce((a, to) => a + recurP1(nodes, to, seen), 0);

    seen.set(node, paths);

    return paths;
};

const recurP2 = (nodes, node, seenDac = false, seenFft = false, seen = new Map()) => {
    if (node === 'out') return seenDac && seenFft ? 1 : 0;

    let k = node+'_'+seenDac+'_'+seenFft;

    if (seen.has(k)) return seen.get(k);

    if (node === 'dac') seenDac = true;
    if (node === 'fft') seenFft = true;

    let paths = nodes[node].reduce((a, to) => a + recurP2(nodes, to, seenDac, seenFft, seen), 0);

    seen.set(k, paths);

    return paths;
};


console.log('p1', recurP1(parse(input), 'you'));
console.log('p2', recurP2(parse(input), 'svr'));
