const init = input => input.split('\n').map(line => line.split('-'));

const run = (connections) => {
    let nodes = {};
    const addNode = (from, to) => {
        if (nodes[from] === undefined) nodes[from] = [];
        nodes[from].push(to);
    }

    connections.forEach(([n1, n2]) => {
        addNode(n1, n2);
        addNode(n2, n1);
    })

    let nodeKeys = Object.keys(nodes),
        maxConnections = Math.max(...Object.values(nodes).map(v => v.length)),
        sets = [[], [], connections.slice()];

    for (let i = 3; i <= maxConnections; i++) {
        let keysAdded = {};
        sets[i] = [];
        sets[i-1].forEach(set => nodeKeys.forEach(n => {
            if (set.includes(n)) return true;
            if (!set.every(sn => nodes[sn].includes(n))) return true;

            let nextSet = [...set, n].sort((a, b) => a.localeCompare(b)),
                k = nextSet.join(',');

            if (keysAdded[k] === undefined) {
                sets[i].push(nextSet);
                keysAdded[k] = 1;
            }
        }))
        
        if (i == 3) console.log('p1', sets[i].filter(arr => arr.some(nk => nk[0] == 't')).length); // p1
    }

    return sets[sets.length-1].join(',');
}

console.log('p2', run(init(input)))
